import React from 'react';
export function Button({variant='primary',className='',...props}) {return <button className={`button button--${variant} ${className}`} {...props}/>}
export function Badge({available}) {return <span className={`badge ${available?'':'badge--out'}`}><span aria-hidden="true">{available?'●':'○'}</span> {available?'Available':'On loan'}</span>}
export function Cover({book,small=false}) {return <div aria-hidden="true" className={`cover cover--${book.id} ${small?'cover--small':''}`}><span className="cover-author">{book.author}</span><span className="cover-title">{book.title}</span><span className="cover-bottom">{book.category}<span>İ</span></span></div>}
export function Empty({title,children,action}) {return <section className="empty"><span className="empty-mark" aria-hidden="true">↳</span><h2>{title}</h2><p>{children}</p>{action}</section>}
