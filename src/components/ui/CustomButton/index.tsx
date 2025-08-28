import PropTypes from "prop-types";
import MUIButton from "@mui/material/Button";
import { useState } from "react";
export default function CustomButton(props: any) {
  const {
    classesNames,
    onClick,
    value,
    disable,
    style,
    endIcon,
    startIcon,
    variant,
    Href,
  } = props;
  const [btn_disable, setDisable] = useState(false);

  const onClickButton = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (props.onClick) {
      onClick(e);
    }
    setTimeout(() => {
      setDisable(false);
    }, 1000);
  };

  return (
    <MUIButton
      className={classesNames}
      disabled={disable ? disable : btn_disable}
      variant={variant}
      onClick={(e) => {
        setDisable(true);
        onClickButton(e);
      }}
      style={style}
      href={Href}
      endIcon={endIcon}
      startIcon={startIcon}
      sx={{
        textTransform: "none",
        borderRadius: 16,
      }}
    >
      {value}
    </MUIButton>
  );
}

CustomButton.defaultProps = {
  value: "",
  classesNames: null,
  size: "small",
  variant: "outlined",
  onClick: () => {},
  disable: false,

  sx: [
    {
      textTransform: "Capitalize",
    },
  ],
};

CustomButton.propTypes = {
  value: PropTypes.any,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["outlined", "standard", "contained"]),
  classesNames: PropTypes.any,
  onClick: PropTypes.func,
  disable: PropTypes.bool,
  fullWidth: PropTypes.bool,
  style: PropTypes.any,
  endIcon: PropTypes.any,
  startIcon: PropTypes.any,
  Href: PropTypes.string,
};