import { FC, ReactNode } from "react";
import Header from "./Header";

interface Props {
    children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
                <Header />
                {/* <div className="max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8"> */}
                <div>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Layout;