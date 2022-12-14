#!/bin/bash

# run this with 
# . ./assume-role
# or
# source ./assume-role
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN


ROLE="${1:-arn:aws:iam::410384406042:role/devireltf-developer-role}"

#aws sts assume-role --role-arn "$ROLE"  --role-session-name AWSCLI-Session

OUT=$(aws sts assume-role --role-arn "$ROLE"  --role-session-name AWSCLI-Session);\
echo $OUT
export AWS_ACCESS_KEY_ID=$(echo $OUT | jq -r '.Credentials''.AccessKeyId');\
export AWS_SECRET_ACCESS_KEY=$(echo $OUT | jq -r '.Credentials''.SecretAccessKey');\
export AWS_SESSION_TOKEN=$(echo $OUT | jq -r '.Credentials''.SessionToken');
