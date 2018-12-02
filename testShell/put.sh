curl -i \
--request PUT \
--header 'Content-type: application/json' \
--header 'Accept: application/json' \
--data '{"status": "down"}' \ #注意一定要把所有属性都写在data里，否则会清空相应的属性
--header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDM3NTMxMDg2Nzd9.1vXd_YRZatKMqFZ74JybbWAxJcFnWAmw7gBj7uLgpxQ' \
http://localhost:3000/vms/fc331758-c4c2-434b-8000-765634df1677
