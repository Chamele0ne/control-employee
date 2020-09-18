import React from 'react'

export const Input = ({ name, onChange, onPress, value }) => {


    return (
        <div className="input-field" >
            <input
                id={name}
                type="text"
                value={value && value}
                name={name}
                onChange={(event) => onChange(event)}
                onKeyPress={onPress ? onPress : null}
            />
            {!value ? <label htmlFor={name}>{name === 'dateofbirth' ? "date of birth" : name}</label> : null}
        </div>
    )
}