import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDroplet, faFillDrip } from '@fortawesome/free-solid-svg-icons'
import React from "react"
import { useRecoilState } from "recoil"
import { style_state } from "../../state"
import { CBCOLOR, CBSTROKE_WIDTH } from "../../constant";
import styles from '../../../styles.module.css'
import produce from "immer";

export const Stylebar: React.FC = () => {
    const [style, set_style] = useRecoilState(style_state);
    const is_fill = style.fill;
    const is_dotted = style.dotted;

    const on_change_color = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.dataset.id) {
            set_style(
                produce((style) => {
                    style.color = e.currentTarget.dataset.id as CBCOLOR;
                })
            )
        }
    }

    const on_change_size = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.dataset.id);
        if (e.currentTarget.dataset.id) {
            set_style(
                produce((style) => {
                    style.size = e.currentTarget.dataset.id as CBSTROKE_WIDTH;
                })
            )
        }
    }

    const on_toggle_dotted = (e: React.MouseEvent<HTMLButtonElement>) => {
        set_style(
            produce((style) => {
                style.dotted = !style.dotted;
            })
        )
    }

    const on_toggle_fill = (e: React.MouseEvent<HTMLButtonElement>) => {
        set_style(
            produce((style) => {
                style.fill = !style.fill; 
            })
        )
    }

    const get_bgcolor = (color: CBCOLOR) => {
        return color === style.color ? { backgroundColor: 'var(--cbDutchWhite)'} : {}; 
    }

    const get_stroke_bgcolor = (width: CBSTROKE_WIDTH) => {
        return width === style.size ? { backgroundColor: 'var(--cbDutchWhite)'} : {}; 
    }

    return (
        <div className={styles.cbToolCotainer}>
            <button data-id={CBCOLOR.BLACK} className={styles.cbToolButton} onClick={on_change_color}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBCOLOR.BLACK) }>
                    <   FontAwesomeIcon icon={faDroplet} color={`var(${CBCOLOR.BLACK})`} />
                </div>
            </button>
            <button data-id={CBCOLOR.BLUE} className={styles.cbToolButton} onClick={on_change_color}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBCOLOR.BLUE) }>
                    <   FontAwesomeIcon icon={faDroplet} color={`var(${CBCOLOR.BLUE})`} />
                </div>
            </button>
            <button data-id={CBCOLOR.DARK_BLUE} className={styles.cbToolButton} onClick={on_change_color}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBCOLOR.DARK_BLUE) }>
                    <   FontAwesomeIcon icon={faDroplet} color={`var(${CBCOLOR.DARK_BLUE})`} />
                </div>
            </button>
            <button data-id={CBCOLOR.GREEN} className={styles.cbToolButton} onClick={on_change_color}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBCOLOR.GREEN) }>
                    <   FontAwesomeIcon icon={faDroplet} color={`var(${CBCOLOR.GREEN})`} />
                </div>
            </button>
            <button data-id={CBCOLOR.RED} className={styles.cbToolButton} onClick={on_change_color}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBCOLOR.RED) }>
                    <   FontAwesomeIcon icon={faDroplet} color={`var(${CBCOLOR.RED})`} />
                </div>
            </button>
            <button data-id={CBCOLOR.YELLOW} className={styles.cbToolButton} onClick={on_change_color}>
                <div className={styles.cbToolButtonHighlight} style={ get_bgcolor(CBCOLOR.YELLOW) }>
                    <   FontAwesomeIcon icon={faDroplet} color={`var(${CBCOLOR.YELLOW})`} />
                </div>
            </button>
            <button data-id={'fill'} className={styles.cbToolButton} onClick={on_toggle_fill}>
                <div className={styles.cbToolButtonHighlight} style={ is_fill ? {backgroundColor: 'var(--cbDutchWhite)'} : {} }>
                    <   FontAwesomeIcon icon={faFillDrip} />
                </div>
            </button>
            <button data-id={'dotted'} className={styles.cbToolButton} onClick={on_toggle_dotted}>
                <div className={styles.cbToolButtonHighlight} style={ is_dotted ? {backgroundColor: 'var(--cbDutchWhite)'} : {} }>
                    <svg width={36} height={36}>
                        <circle cx={8} cy={18} r={7} fill='none' stroke='var(--cbPurple)' strokeLinecap="round" strokeWidth={2} strokeDasharray={4} />
                    </svg>
                </div>
            </button>
            <button data-id={CBSTROKE_WIDTH.SMALL} className={styles.cbToolButton} onClick={on_change_size}>
                <div className={styles.cbToolButtonHighlight} style={ get_stroke_bgcolor(CBSTROKE_WIDTH.SMALL)}>
                    <svg width={36} height={36}>
                        <path d='M 0 18 L 18 18' strokeWidth='var(--cbStrokeWidthS)' stroke='var(--cbPurple)' />
                    </svg>
                </div>
            </button>
            <button data-id={CBSTROKE_WIDTH.MEDIUM} className={styles.cbToolButton} onClick={on_change_size}>
                <div className={styles.cbToolButtonHighlight} style={ get_stroke_bgcolor(CBSTROKE_WIDTH.MEDIUM)}>
                    <svg width={36} height={36}>
                        <path d='M 0 18 L 18 18' strokeWidth='var(--cbStrokeWidthM)' stroke='var(--cbPurple)' />
                    </svg>
                </div>
            </button>
            <button data-id={CBSTROKE_WIDTH.LARGE} className={styles.cbToolButton} onClick={on_change_size}>
                <div className={styles.cbToolButtonHighlight} style={ get_stroke_bgcolor(CBSTROKE_WIDTH.LARGE)}>
                    <svg width={36} height={36}>
                        <path d='M 0 18 L 18 18' strokeWidth='var(--cbStrokeWidthL)' stroke='var(--cbPurple)' />
                    </svg>
                </div>
            </button>
        </div>
    )
}