"use client";
import React from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "danger--primary"
    | "danger--ghost"
    | "danger--tertiary"
    | "tertiary";

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

// 变量映射严格参考 Carbon React Button 设计
const variantStyleMap: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: 'var(--cds-button-primary, #0f62fe)',
        color: 'var(--cds-text-on-color, #fff)',
        borderColor: 'var(--cds-button-primary, #0f62fe)',
    },
    secondary: {
        background: 'var(--cds-button-secondary, #393939)',
        color: 'var(--cds-text-on-color, #fff)',
        borderColor: 'var(--cds-button-secondary, #393939)',
    },
    danger: {
        background: 'var(--cds-button-danger-primary, #da1e28)',
        color: 'var(--cds-text-on-color, #fff)',
        borderColor: 'var(--cds-button-danger-primary, #da1e28)',
    },
    ghost: {
        background: 'var(--cds-background, #ffffff)',
        color: 'var(--cds-button-primary, #0f62fe)',
        borderColor: 'var(--cds-background, #ffffff)',
        boxShadow: 'none',
    },
    'danger--primary': {
        background: 'var(--cds-button-danger-primary, #da1e28)',
        color: 'var(--cds-text-on-color, #fff)',
        borderColor: 'var(--cds-button-danger-primary, #da1e28)',
    },
    'danger--ghost': {
        background: 'var(--cds-background, #fff)',
        color: 'var(--cds-button-danger-secondary, #da1e28)',
        borderColor: 'var(--cds-background, #fff)',
        boxShadow: 'none',
    },
    'danger--tertiary': {
        background: 'var(--cds-text-on-color, #fff)',
        color: 'var(--cds-button-danger-secondary, #da1e28)',
        borderColor: 'var(--cds-button-danger-secondary, #da1e28)',
    },
    tertiary: {
        background: 'var(--cds-text-on-color, #fff)',
        color: 'var(--cds-button-primary, #0050e6)',
        borderColor: 'var(--cds-button-primary, #0050e6)',
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
    // 交互色彩严格对齐 Carbon 设计
    if (variant === 'primary') {
        if (active) {
            baseStyle.background = 'var(--cds-button-primary-active, #002d9c)';
            baseStyle.borderColor = 'var(--cds-button-primary-active, #002d9c)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-button-primary-hover, #0050e6)';
            baseStyle.borderColor = 'var(--cds-button-primary-hover, #0050e6)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        }
    } else if (variant === 'secondary') {
        if (active) {
            baseStyle.background = 'var(--cds-button-secondary-active, #6f6f6f)';
            baseStyle.borderColor = 'var(--cds-button-secondary-active, #6f6f6f)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-button-secondary-hover, #474747)';
            baseStyle.borderColor = 'var(--cds-button-secondary-hover, #474747)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        }
    } else if (variant === 'danger') {
        if (active) {
            baseStyle.background = 'var(--cds-button-danger-active, #750e13)';
            baseStyle.borderColor = 'var(--cds-button-danger-active, #750e13)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.borderColor = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        }
    } else if (variant === 'tertiary') {
        if (active) {
            baseStyle.background = 'var(--cds-button-tertiary-active, #002d9c)';
            baseStyle.borderColor = 'var(--cds-button-tertiary-active, #002d9c)';
            baseStyle.color = 'var(--cds-notification-action-tertiary-inverse, #0f62fe)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-button-tertiary-hover, #0050e6)';
            baseStyle.borderColor = 'var(--cds-button-tertiary-hover, #0050e6)';
            baseStyle.color = 'var(--cds-notification-action-tertiary-inverse, #0f62fe)';
        }
    } else if (variant === 'ghost') {
        if (active) {
            baseStyle.background = 'var(--cds-background-active, rgba(141, 141, 141, 0.5))';
            baseStyle.borderColor = 'var(--cds-background-active, rgba(141, 141, 141, 0.5))';
            baseStyle.color = 'var(--cds-button-primary, #0f62fe)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-background-hover, rgba(141, 141, 141, 0.12))';
            baseStyle.borderColor = 'var(--cds-background-hover, rgba(141, 141, 141, 0.12))';
            baseStyle.color = 'var(--cds-button-primary, #0f62fe)';
        }
    } else if (variant === 'danger--primary') {
        if (active) {
            baseStyle.background = 'var(--cds-button-danger-active, #750e13)';
            baseStyle.borderColor = 'var(--cds-button-danger-active, #750e13)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.borderColor = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        }
    } else if (variant === 'danger--ghost') {
        if (active) {
            baseStyle.background = 'var(--cds-button-danger-primary, #da1e28)';
            baseStyle.borderColor = 'var(--cds-button-danger-active, #750e13)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.borderColor = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        }
    } else if (variant === 'danger--tertiary') {
        if (active) {
            baseStyle.background = 'var(--cds-button-danger-primary, #da1e28)';
            baseStyle.borderColor = 'var(--cds-button-danger-active, #750e13)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
        } else if (hovered) {
            baseStyle.background = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.borderColor = 'var(--cds-button-danger-hover, #b81921)';
            baseStyle.color = 'var(--cds-text-on-color, #fff)';
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
