export const TextInput = ({ value, onChange, censored = false }) => {
    return <input
        value={value}
        onChange={e => onChange(e.target.value)} type={censored ? "password" : "text"}
    />;
};