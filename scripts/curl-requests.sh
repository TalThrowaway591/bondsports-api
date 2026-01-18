# add a new account

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"personId":"person-jf83jso1","dailyWithdrawlLimits":1000,"accountType":0}' \
    http://localhost:3000/api/accounts

# block account

# curl \
#     -X POST \
#     http://localhost:3000/api/accounts/account-Ixi3Xatp/block


# deposit to account

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"amount":500}' \
    http://localhost:3000/api/accounts/account-Ixi3Xatp/deposit



# get statement of account
curl \
    -X GET \
    http://localhost:3000/api/accounts/account-Ixi3Xatp/statement
