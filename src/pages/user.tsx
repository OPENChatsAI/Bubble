import { supabase } from "../supabaseClient"
// import { Auth } from "@supabase/auth-ui-react"
// import { ThemeSupa } from "@supabase/auth-ui-shared";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/layout";


// import { createAvatar } from '@dicebear/core';
// import { micah } from '@dicebear/collection';

export default function User(){
    const nav = useNavigate();
    const [user, setUser]:any = useState({});

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [passConfirm, setPassConfirm] = useState("");

    const [newUser, setNewUser] = useState(false);

    supabase.auth.onAuthStateChange(async(event) => {
        if(event === "SIGNED_IN")
            nav("/chat");
    })

    useEffect(() => {
        getUser();
    }, [])

    async function getUser(){
        await supabase.auth.getUser().then((val) => {
            if(val.data?.user){
                setUser(val.data.user);
            }
        });
    }

    async function logInWithEmail(){
        const {data, error} = await supabase.auth.signInWithPassword({email, password: pass});
        if(error) throw error
        else{
            getUser();
        }
    }

    async function signUpWithEmail(){
        const {data, error} = await supabase.auth.signUp({ email, password: pass});
        if(error) throw error
    }

    async function logOut(){
        const {error} = await supabase.auth.signOut();
        if(error) throw error;
        else window.location.reload();
    }

    // const avatar = createAvatar(micah, {
    //     size: 64,
    //     seed: Math.random().toString()
    // }).toDataUriSync()

    if(Object.keys(user).length == 0){
        return(
            <Layout>
                <main className="flex w-full h-fullScreen debug justify-center items-center">
                    {!newUser ?
                        <section className="w-1/3 flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-lg ml-2 text-green-400">Email</label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="pass" className="text-lg ml-2 text-green-400">Password</label>
                                <input type="password" name="pass" value={pass} onChange={(e) => setPass(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <p className="text-center">New to Bubble? Sign up <button className="underline transition-colors duration-150 ease-in hover:text-green-400" onClick={() => setNewUser(true)}>Here</button>.</p>
                            <button onClick={() => logInWithEmail()} disabled={pass === ""} className="group text-lg flex w-fit self-center px-4 py-1 rounded-md shadow-sm bg-transparent hover:shadow-md hover:bg-slate-700 hover:shadow-green-400/25 transition-all duration-150 ease-in hover:scale-[1.075]">
                                <span className="transition-color delay-75 duration-150 ease-in group-hover:text-green-400">Login</span>
                            </button>
                        </section>
                    :
                        <section className="w-1/3 flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-lg ml-2 text-green-400">Email</label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="pass" className="text-lg ml-2 text-green-400">Password</label>
                                <input type="password" name="pass" value={pass} onChange={(e) => setPass(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="passConfirm" className="text-lg ml-2 text-green-400">Confirm Password</label>
                                <input type="password" name="passConfirm" value={passConfirm} onChange={(e) => setPassConfirm(e.target.value)} className="rounded-md h-10 text-lg px-4 py-0.5 bg-slate-700" />
                            </div>
                            <button onClick={() => signUpWithEmail()} disabled={pass !== passConfirm || (pass === "" || passConfirm === "")} className="group text-lg flex w-fit self-center px-4 py-1 rounded-md shadow-sm bg-transparent hover:shadow-md hover:bg-slate-700 hover:shadow-green-400/25 transition-all duration-150 ease-in hover:scale-[1.075]">
                                <span className="transition-color delay-75 duration-150 ease-in group-hover:text-green-400">Sign up</span>
                            </button>
                        </section>
                    }
                </main>
            </Layout>
        )
    } else {
        return(
            <Layout>
                <h1>Sucess</h1>
                {/* <img src={avatar} alt="Profile Picture" /> */}
                <button onClick={() => logOut()}>Sign out</button>
            </Layout>
        )
    }
}