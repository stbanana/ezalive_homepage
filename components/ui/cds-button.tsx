"use client";
import React from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "ghost"
    | "danger-primary"
    | "danger-tertiary"
    | "danger-ghost";

type BaseProps = {
    variant?: ButtonVariant;
    radius?: string | number;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
};

type ButtonAsButton = BaseProps & {
    as?: "button";
    href?: undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsAnchor = BaseProps & {
    as: "a";
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantStyleMap: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: 'var(--cds-interactive-primary)',
        color: 'var(--cds-text-on-color)',
        borderColor: 'var(--cds-interactive-primary)',
    },
    secondary: {
        background: 'var(--cds-layer)',
        color: 'var(--cds-interactive-primary)',
        borderColor: 'var(--cds-interactive-primary)',
    },
    tertiary: {
        background: 'transparent',
        color: 'var(--cds-interactive-primary)',
        borderColor: 'transparent',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--cds-interactive-primary)',
        borderColor: 'transparent',
        boxShadow: 'none',
    },
    'danger-primary': {
        background: '#da1e28',
        color: '#fff',
        borderColor: '#da1e28',
    },
    'danger-tertiary': {
        background: 'transparent',
        color: '#da1e28',
        borderColor: 'transparent',
    },
    'danger-ghost': {
        background: 'transparent',
        color: '#da1e28',
        borderColor: 'transparent',
        boxShadow: 'none',
    },
};

export const CdsButton: React.FC<ButtonProps> = (props) => {
    const {
        variant = "primary",
        radius = "0.5rem",
        className = '',
        style,
        children,
        ...rest
    } = props;
    const as = (props as ButtonAsAnchor).as || "button";
    const href = (props as ButtonAsAnchor).href;
    const [hovered, setHovered] = React.useState(false);
    const [active, setActive] = React.useState(false);
    let baseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        minHeight: 40,
        padding: '0 1.5rem',
        fontFamily: 'var(--cds-font-sans)',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
        boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.04)',
        textAlign: 'center',
        cursor: 'pointer',
        border: '1px solid',
        transition: 'background 0.15s, color 0.15s, border 0.15s',
        outline: 'none',
        ...variantStyleMap[variant],
        ...style,
    };
    // 交互色彩
    if (variant === 'primary') {
        if (active) {
            baseStyle.background = 'var(--cds-interactive-primary-active, #002d9c)';
            baseStyle.borderColor = 'var(--cds-interactive-primary-active, #002d9c)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-interactive-primary-hover, #0353e9)';
            baseStyle.borderColor = 'var(--cds-interactive-primary-hover, #0353e9)';
        }
    } else if (variant === 'secondary') {
        if (active) {
            baseStyle.background = 'var(--cds-layer-active, #d0e2ff)';
            baseStyle.color = 'var(--cds-interactive-primary-active, #002d9c)';
            baseStyle.borderColor = 'var(--cds-interactive-primary-active, #002d9c)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-layer-hover, #e5f0ff)';
            baseStyle.color = 'var(--cds-interactive-primary-hover, #002d9c)';
            baseStyle.borderColor = 'var(--cds-interactive-primary-hover, #002d9c)';
        }
    } else if (variant === 'tertiary') {
        if (active) {
            baseStyle.background = 'var(--cds-layer-active, #d0e2ff)';
            baseStyle.color = 'var(--cds-interactive-primary-active, #002d9c)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-layer-hover, #e5f0ff)';
            baseStyle.color = 'var(--cds-interactive-primary-hover, #002d9c)';
        }
    } else if (variant === 'ghost') {
        if (active) {
            baseStyle.background = 'var(--cds-layer-active, #d0e2ff)';
            baseStyle.color = 'var(--cds-interactive-primary-active, #002d9c)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-layer-hover, #e5f0ff)';
            baseStyle.color = 'var(--cds-interactive-primary-hover, #002d9c)';
        }
    } else if (variant === 'danger-primary') {
        if (active) {
            baseStyle.background = 'var(--cds-support-error-active, #750e13)';
            baseStyle.borderColor = 'var(--cds-support-error-active, #750e13)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-support-error-hover, #ba1b23)';
            baseStyle.borderColor = 'var(--cds-support-error-hover, #ba1b23)';
        }
    } else if (variant === 'danger-tertiary' || variant === 'danger-ghost') {
        if (active) {
            baseStyle.background = 'var(--cds-support-error-background-active, #ffd6d9)';
            baseStyle.color = 'var(--cds-support-error-active, #750e13)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-support-error-background-hover, #ffd6d9)';
            baseStyle.color = 'var(--cds-support-error-hover, #ba1b23)';
        }
    }

    // 统一 className 前缀
    const cdsClass = `cds-btn cds-btn-${variant.replace('danger-', 'danger-')}`;
    const mergedClass = `${cdsClass} ${className}`.trim();

    if (as === "a" && href) {
        // 只允许 <a> 支持的事件和属性
        const { onClick, ...anchorRest } = rest as ButtonAsAnchor;
        return (
            <a
                href={href}
                className={mergedClass}
                style={baseStyle}
                onClick={onClick}
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => { setHovered(false); setActive(false); }}
                onMouseDown={() => setActive(true)}
                onMouseUp={() => setActive(false)}
                {...anchorRest}
            >
                {children}
            </a>
        );
    }
    // 默认渲染 button
    const { onClick, ...buttonRest } = rest as ButtonAsButton;
    return (
        <button
            type="button"
            className={mergedClass}
            style={baseStyle}
            onClick={onClick}
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => { setHovered(false); setActive(false); }}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
            {...buttonRest}
        >
            {children}
        </button>
    );
};

export default CdsButton;
