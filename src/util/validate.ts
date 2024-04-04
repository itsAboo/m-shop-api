export const isEmail = (email: string) => {
  if (
    typeof email !== "string" ||
    email == null ||
    typeof email == "undefined"
  ) {
    return false;
  }
  return email.trim().length >= 6 && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

export const isPassword = (password: string) => {
  if (
    typeof password !== "string" ||
    password == null ||
    typeof password == "undefined"
  ) {
    return false;
  }
  return password.trim().length >= 6 && password.match(/^[a-zA-Z0-9]+$/);
};

export const isAtLeastFourCha = (cha: string) => {
  if (!cha) {
    return false;
  }
  return cha.length > 3 && cha.match(/^[a-zA-Z]+$/);
};
