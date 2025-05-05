export const getLDEnv = () => ({
    clientId: localStorage.getItem('NEXT_PUBLIC_LD_CLIENT_ID') ?? '',
    apiKey: localStorage.getItem('NEXT_PUBLIC_LD_API_KEY') ?? '',
    projectKey: localStorage.getItem('NEXT_PUBLIC_LD_PROJECT_KEY') ?? '',
    environmentKey: localStorage.getItem('NEXT_PUBLIC_LD_ENVIRONMENT_KEY') ?? '',
  });
  