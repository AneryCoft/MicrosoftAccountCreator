"""
Develped by AneryCoft
Github:https://github.com/AneryCoft
2024.2.21
"""

import execjs
import httpx
import re
import random
import datetime
import pytz
import json


def random_str(length: int) -> str:
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    return "".join(random.choices(characters, k=length))

def ISO_time() -> str:
    """
    JavaScript:
    (new Date).toISOString()
    """
    now = datetime.datetime.now()
    return f'{now.astimezone(pytz.utc).isoformat(timespec="milliseconds").replace("+00:00","")}Z'

def do_submit(code: str, client: httpx.Client, headers: dict, redirects=False) -> httpx.Response | None:
    '''
    Send request from JavaScript
    '''
    url_match = re.search(r'action="(.+?)"', code)
    if url_match:
        url = url_match.group(1)
        method = re.search(r'method="(.+?)"', code).group(1)
        items = re.findall(r"<input (.+?)>", code)
        body = {}
        for item in items:
            name = re.search(r'name="(.+?)"', item).group(1)
            value = re.search(r'value="(.+?)"', item).group(1)
            body[name] = value
        return client.request(
            method=method,
            url=url,
            data=body,
            headers=headers,
            follow_redirects=redirects,
        )
    return None


js_file = open("JavaScript/Encrypt.js", "r")
encrypt_js = execjs.compile(js_file.read())
js_file.close()

email: str
email_suffix = "@outlook.com"
# "@hotmail.com"
password = random_str(10)

client = httpx.Client(http2=True, verify=False, timeout=None)


url = "https://signup.live.com/signup"
headers = {
    "pragma": "no-cache",
    "cache-control": "no-cache",
    "sec-ch-ua": '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-ch-ua-platform-version": '"10.0.0"',
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "x-edge-shopping-flag": "0",
    "sec-fetch-site": "none",
    "sec-fetch-mode": "navigate",
    "sec-fetch-user": "?1",
    "sec-fetch-dest": "document",
    "accept-encoding": "gzip",
    "accept-language": "zh-CN,zh;q=0.9",
}
sign_up = client.get(url=url, headers=headers, follow_redirects=True)
sign_up_page = sign_up.text
# redirect 2 times

uaid = client.cookies["uaid"]
hpgid = int(re.search(r'"hpgid":(.+?),', sign_up_page).group(1))

url = f"https://signup.live.com/API/CheckAvailableSigninNames?lic=1&uaid={uaid}"
canary = re.search(r'"apiCanary":"(.+?)"', sign_up_page).group(1)
headers["canary"] = canary.encode().decode("unicode_escape")
body = {
    "hpgid": hpgid,
    "includeSuggestions": True,
    "scid": 100118,
    "signInName": "",
    "uaid": uaid,
    "uiflvr": 1001,
}

# is name available?
while True:
    email = random_str(15) + email_suffix
    body["signInName"] = email

    check_available_signin_names = client.post(url=url, headers=headers, json=body)
    is_available: bool = check_available_signin_names.json()["isAvailable"]

    canary: str = check_available_signin_names.json()["apiCanary"]
    headers["canary"] = canary

    if is_available:
        break

# create account(get params)

url = "https://signup.live.com/API/CreateAccount"
headers["canary"] = canary

# get params from JavaScript
key = re.search(r'Key="(.+?)"', sign_up_page).group(1)
random_num = re.search(r'randomNum="(.+?)"', sign_up_page).group(1)
cipher_value: str = encrypt_js.call("Encrypt", key, random_num, password)

SKI = re.search(r'SKI="(.+?)"', sign_up_page).group(1)

body = {
    "BirthDate": "21:02:2006",
    "CheckAvailStateMap": [
        email + ":false",
    ],
    "Country": "CN",
    "EvictionWarningShown": [],
    "FirstName": "Coft",
    "IsRDM": False,
    "IsOptOutEmailDefault": True,
    "IsOptOutEmailShown": 1,
    "IsOptOutEmail": True,
    "IsUserConsentedToChinaPIPL": True,
    "LastName": "Anery",
    "LW": 1,
    "MemberName": email,
    "RequestTimeStamp": ISO_time(),
    "ReturnUrl": "",
    "SignupReturnUrl": "",
    "SuggestedAccountType": "EASI",
    "SiteId": "68692",
    "VerificationCode": "",
    "VerificationCodeSlt": "",
    "WReply": "",
    "MemberNameChangeCount": 1,
    "MemberNameAvailableCount": 1,
    "MemberNameUnavailableCount": 0,
    "CipherValue": cipher_value,
    "SKI": SKI,
    "Password": password,
    "uiflvr": 1001,
    "scid": 100118,
    "uaid": uaid,
    "hpgid": hpgid,
}
create_account = client.post(url=url, headers=headers, json=body)

# arkoselabs funcaptcha

# public_key = re.search(r'"sArkoseEnforcementPid":"(.+?)"',sign_up_page).group(1)
public_key = "B7D8911C-5CC8-A9A3-35B0-554ACEE604DA"
json_content: dict = json.loads(create_account.content.decode("unicode_escape"))
data: dict = json.loads(json_content["error"]["data"])
arkose_blob: str = data["arkoseBlob"]

# finish captcha
# request API
solve = ""

# Create account again

risk_assessment_details: str = data["riskAssessmentDetails"]
rep_map_request_identifier_details: str = data["repMapRequestIdentifierDetails"]

HF_id = re.search(r'"sHipFid":"(.+?)"', sign_up_page).group(1)
body_tmp = {
    "RiskAssessmentDetails": risk_assessment_details,
    "RepMapRequestIdentifierDetails": rep_map_request_identifier_details,
    "HFId": HF_id,
    "HPId": public_key,
    "HSol": solve,
    "HType": "enforcement",
    "HId": solve
}
body += body_tmp
create_account_2 = client.post(url=url, headers=headers, json=body)

url = create_account_2.json()["redirectUrl"]
headers.pop("canary")
slt: str = create_account_2.json()["slt"]
body = {"slt": slt}
login = client.post(url=url, headers=headers, json=body)

# privacy notice

privacy_notice = do_submit(login.text, client, headers)
privacy_notice_page = privacy_notice.text

encrypted_request_payload = re.search(
    r'"EncryptedRequestPayload":"(.+?)"', privacy_notice_page
).group(1)
init_vector = re.search(
    r'"InitVector":(.+?)"', privacy_notice_page
).group(1)
encrypted_payload_hash_value = re.search(
    r'"EncryptedPayloadHashValue":"(.+?)"', privacy_notice_page
).group(1)

url = "https://privacynotice.account.microsoft.com/recordnotice"
body = {
    "EncryptedRequestPayload": encrypted_request_payload,
    "InitVector": init_vector,
    "EncryptedPayloadHashValue": encrypted_request_payload,
}
record_notice = client.post(url=url, headers=headers, json=body)
