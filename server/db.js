module.exports = () => {
  return {
    authenticate: [{
      id: 'test',
      message: 'login success.',
      info: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><AuthenticateResponse xmlns="http://api.jumpstart.com/"><AuthenticationInfo><UserName>Grade1_Janardan@jumpstart.com</UserName><Email>grade1_janardan@jumpstart.com</Email><ApiToken>278bdb8e-83b2-4531-96a6-80776ed2cd0a</ApiToken><UserID>bc747106-df91-48c0-a0b8-15ac66b891a5</UserID><AccountOwnerLoginInfo xsi:nil="true" /><CudosToken>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJHcmFkZTFfSmFuYXJkYW5AanVtcHN0YXJ0LmNvbSIsImp0aSI6IjJkZjZkYjJiLTM2ZmEtNDFmZi1iNzQ2LWYxMzM1OGUyZGUwNyIsImxvY2FsZSI6ImVuLVVTIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJHcmFkZTFfSmFuYXJkYW5AanVtcHN0YXJ0LmNvbSIsImFwcGlkIjoiNzc1QkMxRjEtRTA2NC1FQzhFLThBNDMtQzY0NzdERjlEMDU2IiwidXNlcmlkIjoiYmM3NDcxMDYtZGY5MS00OGMwLWEwYjgtMTVhYzY2Yjg5MWE1IiwicGlkIjoiYzIwZTRjNDYtZDI0Ni00N2QyLWFmNTUtOGFmNDRkMDdhODg2IiwiZXhwIjoxNjI0NTIyMTEyLCJpc3MiOiJIdHRwczovL0N1RE9TLkp1bXBTdGFydC5jb20iLCJhdWQiOiJIdHRwczovL0N1RE9TLkp1bXBTdGFydC5jb20ifQ.5i2N3LowzbdY9-UbAEyzZG_11n9xmRVflrpb-FhdTgs</CudosToken><ExpiryDate xsi:nil="true" /><LoginStatus>Success</LoginStatus><Role>Teacher</Role><UnAuthorized>true</UnAuthorized><IsUserAllowedToPlay xsi:nil="true" /><gsk>11A0CC5A-C4DF-4A0E-931C-09A44C9966AE</gsk><isFirstTimeUser>false</isFirstTimeUser></AuthenticationInfo></AuthenticateResponse></soap:Body></soap:Envelope>'
    }, {
      id: 'test1',
      message: 'login error.',
      info: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><AuthenticateResponse xmlns="http://api.jumpstart.com/"><AuthenticationInfo><UserName xsi:nil="true" /><Email xsi:nil="true" /><ApiToken>332b72cf-e351-412b-9446-3aed4e9f25d6</ApiToken><UserID>00000000-0000-0000-0000-000000000000</UserID><AccountOwnerLoginInfo xsi:nil="true" /><CudosToken xsi:nil="true" /><ExpiryDate xsi:nil="true" /><LoginStatus>InvalidPassword</LoginStatus><Role>Teacher</Role><UnAuthorized xsi:nil="true" /><IsUserAllowedToPlay xsi:nil="true" /><gsk>11A0CC5A-C4DF-4A0E-931C-09A44C9966AE</gsk><isFirstTimeUser>false</isFirstTimeUser></AuthenticationInfo></AuthenticateResponse></soap:Body></soap:Envelope>'
    }],
    Teacher: [{
      id: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKYW5hcmRhbiBCZWhhcmEiLCJqdGkiOiI0NjEyNGJlOC0wZmQ0LTQ0YzEtYjAwNy04M2MwZWI0MTdiZGUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IkphbmFyZGFuIEJlaGFyYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJHcmFkZTFfSmFuYXJkYW5AanVtcHN0YXJ0LmNvbSIsInVzZXJpZCI6ImJjNzQ3MTA2LWRmOTEtNDhjMC1hMGI4LTE1YWM2NmI4OTFhNSIsInNzb19zb3VyY2UiOiJqdW1wc3RhcnQiLCJzc29fdXNlcmlkIjoiYmM3NDcxMDYtZGY5MS00OGMwLWEwYjgtMTVhYzY2Yjg5MWE1IiwiYXZhdGFyIjoiIiwiZXhwIjoxNTkzMTU5MzcxLCJpc3MiOiJIdHRwczovL0N1RE9TLkp1bXBTdGFydC5jb20iLCJhdWQiOiJIdHRwczovL0N1RE9TLkp1bXBTdGFydC5jb20ifQ.-Qw2csZC7NXyBM70bWg0Rgqc9VqqPzWCudcacX5rfaQ',
      userName: 'Janardan Behara',
      userId: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
      email: 'Grade1_Janardan@jumpstart.com',
      userType: 'Teacher',
      avatar: null
    }]
  }
}
