'use strict';

export interface Platform
{
	name: string;
	version: string;
}

function system( )
{
	if ( typeof navigator === 'undefined' || !navigator.userAgent )
		return { name: 'node', version: 'unknown' };
	var tmp;
	var ua = navigator.userAgent;
	var re = /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i;
	var M = ua.match( re ) || [ ];

	if ( /trident/i.test( M[ 1 ] ) )
	{
		tmp = ( /\brv[ :]+(\d+)/g.exec( ua ) ) || [ ];
		return {
			name: 'IE',
			version: ( tmp[ 1 ] || '' )
		};
	}

	if ( M[ 1 ] === 'Chrome' )
	{
		tmp = ua.match( /\b(OPR|Edge)\/(\d+)/ );
		if ( tmp != null )
			return {
				name: ( tmp[ 1 ].replace( 'OPR', 'Opera' ) ),
				version: tmp[ 2 ]
			};
	}

	M = M[ 2 ]
		? [ M[ 1 ], M[ 2 ] ]
		: [ navigator.appName, navigator.appVersion + '-?' ];
	if ( ( tmp = ua.match( /version\/(\d+)/i ) ) != null )
		M.splice( 1, 1, tmp[ 1 ] );

	return {
		name: M[ 0 ],
		version: M[ 1 ]
	};
}

export const platform = system( );
