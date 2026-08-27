import './fullScreen.css';

const FullScreenDisplay = ({ url, alts }: { url: string; alts: string }) => {
    return (
        <div className="content">
            <img src={url} alt={alts} className="img" />
        </div>
    );
};

export default FullScreenDisplay;
