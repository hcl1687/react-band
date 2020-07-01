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
    }],
    GetAssignmentsFeedback: [{
      Id: 'da1b68e5-f022-4906-9bbe-9b94d7bccde1',
      ActivityId: '5250f42a-a207-467b-b8b5-c4bbc3f626af',
      Version: 'f46abf7d-1eca-48c4-9921-058b7d9cc2d3',
      Name: 'test assignment',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 1,
      Questions: 6,
      CreatedTime: 1592988031,
      DeadlineTime: 1595606399
    }, {
      Id: '3eaa92e8-1db7-4a66-baad-7e245b26689c',
      ActivityId: '7e22dcfd-01fa-4e93-aba1-f051669e30f5',
      Version: 'd8d23da5-630a-4bbd-939c-1348256e4f5b',
      Name: 'Activity-2',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 1,
      Questions: 3,
      CreatedTime: 1592983802,
      DeadlineTime: 1595606399
    }, {
      Id: '1c0187c8-4e51-4be8-a770-bdea7f5a118d',
      ActivityId: '65e76566-4cbf-47d3-a925-ac00f2f004a9',
      Version: '54f0ccff-1f1c-4d77-af8a-7d2fb23fa113',
      Name: 'Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane.',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 1,
      Questions: 8,
      CreatedTime: 1592983573,
      DeadlineTime: 1595606399
    }, {
      Id: '0713b0a3-80f7-4e0e-90b7-2f6c6e87e138',
      ActivityId: 'e7f78ff9-825f-40e3-a1f3-7c24e1799e7e',
      Version: '814ee61b-e17c-4cbe-96e7-4d6bcf9c1e45',
      Name: 'dev assignment',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 1,
      Questions: 5,
      CreatedTime: 1592983295,
      DeadlineTime: 1595606399
    }, {
      Id: 'f5bce740-8ff0-4d2b-a733-93a41f0b03e2',
      ActivityId: '6a1d2f25-3c19-4be3-a931-b931834fd462',
      Version: '49836889-2828-46d4-8478-d1a0dcca4588',
      Name: 'Activity-2',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 1,
      Questions: 9,
      CreatedTime: 1592979470,
      DeadlineTime: 1595606399
    }, {
      Id: '05c079e1-af52-41f5-9f59-e5921271f5ca',
      ActivityId: 'bb331787-3c21-485a-9a00-268bdb9aa346',
      Version: '67f08be1-3d8c-4425-b881-da5241b1ee6d',
      Name: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
      PlayType: 'SoloLive',
      Accuracy: 25,
      UsersCount: 2,
      Questions: 2,
      CreatedTime: 1592806101,
      DeadlineTime: 1592806203
    }, {
      Id: '5e595be9-c1e1-4ffc-998c-1ac990b13f9a',
      ActivityId: '7e22dcfd-01fa-4e93-aba1-f051669e30f5',
      Version: 'd8d23da5-630a-4bbd-939c-1348256e4f5b',
      Name: 'Activity-2',
      PlayType: 'TeamLive',
      Accuracy: 0,
      UsersCount: 5,
      Questions: 3,
      CreatedTime: 1592536743,
      DeadlineTime: 1592538403
    }, {
      Id: 'e72fbf64-e465-4645-a49e-58478dea6fc7',
      ActivityId: 'bb331787-3c21-485a-9a00-268bdb9aa346',
      Version: '67f08be1-3d8c-4425-b881-da5241b1ee6d',
      Name: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
      PlayType: 'TeamLive',
      Accuracy: null,
      UsersCount: 0,
      Questions: 2,
      CreatedTime: 1592464510,
      DeadlineTime: 1592529743
    }, {
      Id: '0dd93bbb-5257-4014-963a-1b30929090e6',
      ActivityId: 'bb331787-3c21-485a-9a00-268bdb9aa346',
      Version: '67f08be1-3d8c-4425-b881-da5241b1ee6d',
      Name: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
      PlayType: 'TeamLive',
      Accuracy: null,
      UsersCount: 5,
      Questions: 2,
      CreatedTime: 1592464366,
      DeadlineTime: 1592464495
    }, {
      Id: '0b2d8db4-b26d-42fe-a61b-23e79c7c037f',
      ActivityId: 'bb331787-3c21-485a-9a00-268bdb9aa346',
      Version: '67f08be1-3d8c-4425-b881-da5241b1ee6d',
      Name: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
      PlayType: 'TeamLive',
      Accuracy: null,
      UsersCount: 5,
      Questions: 2,
      CreatedTime: 1592464282,
      DeadlineTime: 1592464359
    }, {
      Id: '2ae4ebed-f652-4968-b8da-062cfeb86bd4',
      ActivityId: 'bb331787-3c21-485a-9a00-268bdb9aa346',
      Version: '67f08be1-3d8c-4425-b881-da5241b1ee6d',
      Name: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
      PlayType: 'TeamLive',
      Accuracy: 0,
      UsersCount: 5,
      Questions: 2,
      CreatedTime: 1592464192,
      DeadlineTime: 1592464273
    }, {
      Id: '407b2ea4-8f72-4da3-87b6-0f917ec47ab9',
      ActivityId: 'bb331787-3c21-485a-9a00-268bdb9aa346',
      Version: '67f08be1-3d8c-4425-b881-da5241b1ee6d',
      Name: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
      PlayType: 'TeamLive',
      Accuracy: 80,
      UsersCount: 5,
      Questions: 2,
      CreatedTime: 1592463880,
      DeadlineTime: 1592464148
    }, {
      Id: 'af075379-749c-4065-b73f-79d763759b71',
      ActivityId: 'bb331787-3c21-485a-9a00-268bdb9aa346',
      Version: '67f08be1-3d8c-4425-b881-da5241b1ee6d',
      Name: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
      PlayType: 'TeamLive',
      Accuracy: 40,
      UsersCount: 5,
      Questions: 2,
      CreatedTime: 1592463477,
      DeadlineTime: 1592463859
    }, {
      Id: '1eb461dd-06c3-4f58-b6b4-d71297f5817b',
      ActivityId: 'a6e08524-2d93-44b5-ae8b-5755e431faff',
      Version: '63ad4f64-2826-4f90-82ec-b1b87e948ddf',
      Name: 'test add',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 0,
      Questions: 1,
      CreatedTime: 1592390980,
      DeadlineTime: 1592390984
    }, {
      Id: '1e3f9b6b-d694-4bd0-82dd-19e20cbb6532',
      ActivityId: 'a6e08524-2d93-44b5-ae8b-5755e431faff',
      Version: '63ad4f64-2826-4f90-82ec-b1b87e948ddf',
      Name: 'test add',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 0,
      Questions: 1,
      CreatedTime: 1592390604,
      DeadlineTime: 1592390609
    }]
  }
}
