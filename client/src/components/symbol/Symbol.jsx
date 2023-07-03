export const Symbol = ({symbol, color = "black", opacity = 1, fontSize = "16px"}) => {
    return <span style={{color: "transparent", textShadow: `0 0 0 ${color}`, opacity, fontSize}}>{symbol}</span>
}
