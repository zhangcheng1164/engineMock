curl -i  \
--request POST \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Accept: application/json' \
--data 'username=admin@internal&password=admin==1&grant_type=password&scope=ovirt-app-api' \
http://localhost:3000/token

