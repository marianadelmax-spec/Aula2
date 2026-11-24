const InputGroup = ({
    type, placeholder, name, value, onChange, label, accept, min, step, inputRef
}) => {
    return (
        <div className="input-group mb-3">
            <span className="input-group-text">{label}</span>
            <input className="form-control"
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                accept={accept}
                min={min}
                step={step}
                ref={inputRef}
            />
        </div>
    )
}

export default InputGroup;
