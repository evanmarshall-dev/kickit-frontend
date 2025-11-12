const API_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

if (!API_URL) {
  console.error(
    "⚠️ VITE_BACK_END_SERVER_URL is not defined. API calls will fail."
  );
}

export const kickService = {
  async fetchKicks() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/kicks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to load kicks";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error ||
            errorData.err ||
            errorData.message ||
            errorMessage;
        } catch {
          if (response.status === 401) {
            errorMessage = "Your session has expired. Please sign in again.";
          } else {
            errorMessage = `Unable to load kicks. Please try again. (Error ${response.status})`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message) throw error;
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }
  },

  async createKick(kickData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/kicks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kickData),
    });

    if (!response.ok) {
      let errorMessage = "Failed to create kick";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.err || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  },

  async updateKick(kickId, kickData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/kicks/${kickId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kickData),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update kick";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.err || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  },

  async deleteKick(kickId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/kicks/${kickId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete kick";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.err || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  },

  async toggleStatus(kickId, newStatus) {
    return this.updateKick(kickId, { status: newStatus });
  },

  async fetchKickById(kickId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/kicks/${kickId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch kick";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.err || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  },

  async addComment(kickId, commentText) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/kicks/${kickId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to add comment";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.err || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  },

  async deleteComment(kickId, commentId) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/kicks/${kickId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete comment";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.err || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  },

  async updateComment(kickId, commentId, commentText) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/kicks/${kickId}/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to update comment";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.err || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  },
};
