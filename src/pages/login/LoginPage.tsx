import Login from "../../components/login/Login";

const LoginPage: React.FC = () => {
    return (
        <>
            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100vw',
                }}
            >
                <Login />
            </div>

        </>

    );
};

export default LoginPage;