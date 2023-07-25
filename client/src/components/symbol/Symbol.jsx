export const Symbol = ({ symbol, color = "black", opacity = 1, fontSize = "16px", onClick, cursor, customStyles, className }) => {
    return <span
        style={{ color: "transparent", textShadow: `0 0 0 ${color}`, opacity, fontSize, cursor, ...customStyles }}
        className={className}
        onClick={() => onClick && onClick()}
    >
        {symbol}
    </span>
}
