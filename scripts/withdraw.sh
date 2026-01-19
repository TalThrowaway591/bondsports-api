#!/bin/bash

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"amount":$2}' \
    http://localhost:3000/api/accounts/account-nv49u32z/withdraw
