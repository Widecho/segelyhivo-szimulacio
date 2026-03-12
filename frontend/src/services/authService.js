const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const loginUser = async (loginData) => {
  await wait(500);

  return {
    success: true,
    message: `Sikeres bejelentkezési próbálkozás: ${loginData.username}`,
  };
};

export const registerUser = async (registerData) => {
  await wait(500);

  return {
    success: true,
    message: `Sikeres regisztrációs próbálkozás: ${registerData.username}`,
  };
};