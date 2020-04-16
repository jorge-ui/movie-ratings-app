import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core";

export interface INavItem {
	icon:  OverridableComponent<SvgIconTypeMap>
	text: string,
	to: string
}