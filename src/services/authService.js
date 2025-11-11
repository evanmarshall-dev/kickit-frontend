const API_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

if (!API_URL) {
  console.error(
    "⚠️ VITE_BACK_END_SERVER_URL is not defined. API calls will fail."
  );
}

export const authService = {
  async signup(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = "Sign up failed";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.err ||
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          if (response.status === 409) {
            errorMessage =
              "This username is already taken. Please choose a different username.";
          } else if (response.status === 400) {
            errorMessage = "Please fill in all required fields correctly.";
          } else {
            errorMessage = `Unable to connect to server. Please try again later. (Error ${response.status})`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      if (error.message) throw error;
      throw new Error(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    }
  },

  async signin(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = "Sign in failed";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.err ||
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          if (response.status === 401) {
            errorMessage =
              "Invalid username or password. Please check your credentials and try again.";
          } else if (response.status === 400) {
            errorMessage = "Please provide both username and password.";
          } else {
            errorMessage = `Unable to connect to server. Please try again later. (Error ${response.status})`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      if (error.message) throw error;
      throw new Error(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
