export default function objectsHaveSameProps( obj1, obj2 ) {
    var obj1Props = Object.keys( obj1 ),
        obj2Props = Object.keys( obj2 );

    if ( obj1Props.length == obj2Props.length ) {
        return obj1Props.every( function( prop ) {
          return obj2Props.indexOf( prop ) >= 0;
        });
    }

    return false;
}
