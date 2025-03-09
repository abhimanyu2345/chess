import { useEffect, useState } from "react";
import axios from "axios";
import { authResult, User } from "../constants/types";
import { host } from "../constants/Constants";

const useAuth = (): authResult => {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `https://${host}/verify-token`,
          {},
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          const { Id, username, email, token } = response.data;
          localStorage.setItem('token', token);
          window.dispatchEvent(new Event('storage')); // Force UI update
          setAuthStatus('authenticated');
          setUser({ Id, username, email });
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (err) {
        setError('Failed to authenticate');
        setAuthStatus('unauthenticated');
      }
    };
  
    checkAuth();
  }, []); 
  
  return { authStatus, user, error };
};

export default useAuth;
