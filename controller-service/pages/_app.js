import App from "../react/App";
import '../react/index.css';
import Head from 'next/head';


export default function Root() {
    return <div>
        <Head>
            <meta charSet="utf-8" />
            <link rel="icon" href="/logo.png" />
            <meta name="viewport" content="width=device-width, initial-scale=0.8" />
            <meta name="theme-color" content="#000000" />
            <meta
                name="description"
                content="Web site created using create-react-app"
            />
            <link rel="apple-touch-icon" href="/logo.png" />
            <title>React App</title>
        </Head>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <App />
    </div>
}
