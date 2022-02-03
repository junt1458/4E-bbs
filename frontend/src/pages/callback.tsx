import { NextPage } from "next";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { currentUserState } from "../states/currentUser";
import { SERVER_URI } from "../utils/constants";
import { fetchCurrentUser } from "../utils/currentUser";

const CallbackPage: NextPage = () => {
    const router = useRouter();
    const setCurrentUser = useSetRecoilState(currentUserState);

    useEffect(() => {
        async function fetchTokens() {
            const response = await fetch(SERVER_URI + '/auth/oauth2?mode=token', {
                credentials: 'include'
            });
            const json = await response.json();
            if(json.error) {
                router.push({
                    pathname: "/login",
                    query: {
                        "err": json.error
                    }
                });
                return;
            }

            setCookie(null, 'access_token', json.access_token);
            setCookie(null, 'refresh_token', json.refresh_token);

            try {
                const currentUser = await fetchCurrentUser();
                setCurrentUser(currentUser);
            } catch {
                setCurrentUser(null);
            }
            router.push('/');
        }
        fetchTokens();
    }, [router]);
    return <></>;
};

export default CallbackPage;
