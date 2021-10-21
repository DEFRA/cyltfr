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
      <!-- they have names, titles and abstracts -->

      <Title>Reservoirs wet extent</Title>
      <Abstract></Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- a feature type for polygons -->

      <FeatureTypeStyle>
        <!--FeatureTypeName>Feature</FeatureTypeName-->
        <Rule>
          <Name>Rule 1</Name>
          <Title>Reservoirs wet</Title>
          <Abstract></Abstract>
          <!-- like a linesymbolizer but with a fill too -->
          <PolygonSymbolizer>
              <Fill>
                <GraphicFill>
                  <Graphic>
                    <Mark>
                      <WellKnownName>shape://slash</WellKnownName>
                      <Stroke>
                        <CssParameter name="stroke">#ff3232</CssParameter>
                        <CssParameter name="stroke-width">2</CssParameter>
                      </Stroke>
                    </Mark>
                    <Size>16</Size>
                  </Graphic>
                </GraphicFill>
              </Fill>
              <Stroke>
                <CssParameter name="stroke">#ff3232</CssParameter>
                <CssParameter name="stroke-width">0.4</CssParameter>
                <CssParameter name="stroke-linejoin">bevel</CssParameter>
              </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>