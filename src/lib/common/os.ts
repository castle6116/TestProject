const macosPattern = /(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)|(iPhone)|(iPad)|(iPod)/i;

const windowsPattern = /(Win32)|(Win64)|(Windows)|(WinCE)/i;

export function getOs(): "mac" | "windows" {
	if (typeof window === "undefined") {
		return "windows";
	}

	const { userAgent } = window.navigator;

	if (macosPattern.test(userAgent)) {
		return "mac";
	}
	if (windowsPattern.test(userAgent)) {
		return "windows";
	}

	return "windows";
}

// Just to give you an idea, the following properites
// are options for the legacy 'navigator.platform':
//
// HP-UX
// Linux i686
// Linux armv7l
// Mac68K
// MacPPC
// MacIntel
// SunOS
// Win16
// Win32
// WebTV OS
