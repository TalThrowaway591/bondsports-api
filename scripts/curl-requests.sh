# add a new account

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"personId":"person-jf83jso1","dailyWithdrawlLimits":1000,"accountType":0}' \
    http://localhost:3000/api/accounts

# block account

# curl \
#     -X POST \
#     http://localhost:3000/api/accounts/account-nv49u32z/block


# deposit to account

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"amount":500}' \
    http://localhost:3000/api/accounts/account-nv49u32z/deposit



# get statement of account
curl \
    -X GET \
    http://localhost:3000/api/accounts/account-nv49u32z/statement

curl \
    -X GET \
    "http://localhost:3000/api/accounts/account-nv49u32z/statement?from=2026-01-02"

curl \
    -X GET \
    "http://localhost:3000/api/accounts/account-nv49u32z/statement?from=2026-01-02&to=2026-01-06"
