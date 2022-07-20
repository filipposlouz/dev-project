import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

class Auth {
  constructor() {
    this.authenticated = false;
    this.role = null;
    this.name = null;
    this.email = null;
    this.department = null;
  }

  async getUserState() {
    try {
      const cookie = getCookie("sid");
      if (cookie === undefined) {
        return;
      } else {
        const res = await fetch("http://localhost:5000/api/checkIfAuth", {
          method: "GET",
          credentials: "include",
        }).then((res) => res.json());
        if (res.status === "success") {
          this.authenticated = true;
          this.role = res.role;
          this.name = res.name;
          this.email = res.email;
          this.department = res.department;
          return;
        } else {
          return;
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  logout() {
    this.authenticated = false;
  }

  getEmail() {
    return this.email;
  }

  getName() {
    return this.name;
  }

  getRole() {
    return this.role;
  }

  getDepartment() {
    return this.department;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
