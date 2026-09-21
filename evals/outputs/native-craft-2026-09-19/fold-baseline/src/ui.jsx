import React from 'react';
export function Button({variant='primary',className='',...props}){return <button className={`button ${variant} ${className}`} {...props}/>}
export function Motif({craft}){return <div aria-hidden="true" className={`motif ${craft.toLowerCase()}`}><i/><i/><i/><i/></div>}
export function Badge({children}){return <span className="badge">{children}</span>}
