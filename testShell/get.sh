curl -i \
--request GET \
--header 'Content-type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDM3NTMxMDg2Nzd9.1vXd_YRZatKMqFZ74JybbWAxJcFnWAmw7gBj7uLgpxQ' \
#http://localhost:3000/hosts?_embed=vms #向下级联 
#http://localhost:3000/vms?_expand=host #向上级联
#http://localhost:3000/vms?name_like=vm #模糊查询
#http://localhost:3000/vms?_start=20&_limit=10 #分页
