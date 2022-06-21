export const getData = async () => {
  return await fetch(`https://gorest.co.in/public/v2/users`)
    .then((result) => {
      if (result.ok) {
        return result.json();
      } else {
        throw new Error(alert(" Internal Server Error. Can't display news "));
      }
    })
    .then((userInfo) => {
      return userInfo;
    })
    .then((arr) =>
      arr.map(({ id, name, email, gender, status }) => ({
        key: id,
        name: name,
        email: email,
        gender: gender,
        status: status,
      }))
    );
};

export const editUser = async (eventData) => {
  return fetch(`https://gorest.co.in/public/v2/users`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer 81b87d425dfc4a2c7b160dfb7f6b99e71b30ef00e92bb01a3af6040f9ac31126",
    },
    body: JSON.stringify({
      name: "Allasani Peddana",
      email: "allasani.peddana@15ce.com",
      status: "active",
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(alert(" Internal Server Error. Can't display events "));
    }
  });
};

export default getData;
