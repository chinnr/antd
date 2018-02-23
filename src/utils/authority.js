// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('authority') || 'guest';
}

export function setAuthority(authority) {
  console.log("setAuthority: ", authority);
  return localStorage.setItem('authority', authority);
}
