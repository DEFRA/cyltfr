<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
 xmlns="http://www.opengis.net/sld" 
 xmlns:ogc="http://www.opengis.net/ogc" 
 xmlns:xlink="http://www.w3.org/1999/xlink" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>5-SOFR</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Speed of flooding from reservoirs</Title>
      <Abstract></Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering polygons -->
      <FeatureTypeStyle>
        
        
        <Rule>
          <Name>> 2.0m/s</Name>
          <Title>> 2.0m/s</Title>
        <ogc:Filter>
          <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>velocity</ogc:PropertyName>
            <ogc:Literal>> 2.0m/s</ogc:Literal>
            </ogc:PropertyIsEqualTo>
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#3D4489</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
        
        <Rule>
          <Name>0.5 - 2.0m/s</Name>
          <Title>0.5 - 2.0m/s</Title>

          <!-- like a polygonsymbolizer -->
        <ogc:Filter>
          <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>velocity</ogc:PropertyName>
            <ogc:Literal>0.5 - 2.0m/s</ogc:Literal>
            </ogc:PropertyIsEqualTo>
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#6699CD</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
        
        <Rule>
          <Name>0 - 0.5m/s</Name>
          <Title>0 - 0.5m/s</Title>

        <ogc:Filter>
          <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>velocity</ogc:PropertyName>
            <ogc:Literal>0 - 0.5m/s</ogc:Literal>
            </ogc:PropertyIsEqualTo>
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#A2CFFF</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
        
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>