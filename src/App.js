import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoute } from './routes';
import { DefaultLayout } from '~/Layout';
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
    return (
        <GoogleOAuthProvider clientId="724900154435-vt74mfu0m0r5v8gm2fqrj027n8t6242n.apps.googleusercontent.com">
            <Router>
                <div className="App">
                    <Routes>
                        {publicRoute.map((route, index) => {
                            const Layout = route.Layout || DefaultLayout;
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
