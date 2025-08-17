export function interceptFetch() {
    if (typeof window === "undefined") return;
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);

        if (response.status === 403 || response.status === 401) {

          window.location.href = "/admin/login";
        }

    return response;
  };
}