<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
    xmlns="http://www.opengis.net/sld" 
    xmlns:ogc="http://www.opengis.net/ogc" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <!-- a named layer is the basic building block of an sld document -->

  <NamedLayer>
    <Name>reservoirs-wet</Name>
    <UserStyle>
      <Name>Reservoirs wet extents</Name>
      <FeatureTypeStyle>
        <Rule>
          <Name>Single symbol</Name>
          <PolygonSymbolizer>
            <Fill>
              <GraphicFill>
                <Graphic>
                  <Mark>
                    <WellKnownName>slash</WellKnownName>
                    <Stroke>
                      <SvgParameter name="stroke">#ff3232</SvgParameter>
                    </Stroke>
                  </Mark>
                </Graphic>
              </GraphicFill>
            </Fill>
            <Stroke>
              <SvgParameter name="stroke">#ff3232</SvgParameter>
              <SvgParameter name="stroke-width">1</SvgParameter>
              <SvgParameter name="stroke-linejoin">bevel</SvgParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>