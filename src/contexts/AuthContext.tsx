import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserSave } from "@storage/storageUser";
import { createContext, ReactNode, useState } from "react";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [refreshedToken, setRefreshedToken] = useState('');
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true);
      await storageUserSave(userData);
      await storageAuthTokenSave(token);

    } catch (error) {
      throw error;

    } finally {
      setIsLoadingUserStorageData(false);

    }
  }

  async function signIn(email: string, password: string) {
    try {
      setIsLoadingUserStorageData(true);
      const { data } = await api.post('sessions', { email, password });

      if (data.user && data.token) {
        await storageUserAndTokenSave(data.user, data.token);
        userAndTokenUpdate(data.user, data.token);
      }

    } catch (error) {
      throw error;
    }finally {
      setIsLoadingUserStorageData(false);

    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}