var myHeaders = new Headers();
myHeaders.append("Cookie", "idsafety=3euq1tnkqeor2bu74o0a3tlrr933cevk");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

export const data = async () => fetch("http://localhost/orcamento_api/admin/menu", requestOptions)
  .then(response => { console.log(response.json()); return response.json().data.menu})
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
