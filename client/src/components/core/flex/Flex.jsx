import styles from './flex.module.css';

export const Flex = ({children, label, style = defaultStyle}) => {
    return (
        <div className={styles.flex} style={style}>
            {label && <span>{label}</span>}
            {children}
        </div>
    )
};

const defaultStyle = {
    height: "52px",
};
