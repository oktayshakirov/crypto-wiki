import React, { Component } from "react";
import PropTypes from "prop-types";
import loadScript from "../services/loadScript";

export default class BannersLoader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bannerTypeForLoad: "",
		};
		this.bannersConfig = {
			typeOne: {
				code: "idBanner",
				style: { display: "inline-block", width: "300px", height: "250px" },
			},
			typeTwo: {
				code: "idBanner",
				style: { display: "inline-block", width: "300px", height: "250px" },
			},
			typeThree: {
				code: "idBanner",
				style: { display: "inline-block", width: "1px", height: "1px" },
			},
		};
		this.bmScript = null;
	}

	componentDidMount() {
		const bannerTypeForLoad = "bitmedia";
		this.setState({ bannerTypeForLoad });
		this.setCounterBannerLoaded();
	}

	componentWillUnmount() {
		if (this.bmScript) {
			this.bmScript.remove();
			if (window.bmblocks && window.bmblocks[this.bannersConfig[this.props.name].code]) {
				delete window.bmblocks[this.bannersConfig[this.props.name].code];
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.bannerTypeForLoad !== this.state.bannerTypeForLoad) {
			this.bmScript = loadScript(`//bmcdn5.com/js/${this.bannersConfig[this.props.name].code}.js`);
		}
	}

	setCounterBannerLoaded() {
		const dataFromStorage = localStorage.getItem("banners");
		let bannersCounterObj = {};
		const setItem = {};
		setItem[this.props.name] = 1;
		if (dataFromStorage) {
			try {
				bannersCounterObj = JSON.parse(dataFromStorage);
				if (bannersCounterObj[this.props.name]) {
					setItem[this.props.name] += +bannersCounterObj[this.props.name];
				}
			} catch (e) {
				bannersCounterObj = {};
			}
		}

		localStorage.setItem("banners", JSON.stringify({ ...bannersCounterObj, ...setItem }));
	}

	render() {
		const { name } = this.props;
		const selectedBanner = this.bannersConfig[name];
		return (
			<div className="banners-container">
				<ins className={`${selectedBanner.code}`} style={selectedBanner.style} />
			</div>
		);
	}
}

BannersLoader.propTypes = {
	name: PropTypes.string.isRequired,
};