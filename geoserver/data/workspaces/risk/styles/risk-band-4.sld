<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
 xmlns="http://www.opengis.net/sld" 
 xmlns:ogc="http://www.opengis.net/ogc" 
 xmlns:xlink="http://www.w3.org/1999/xlink" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>risk-band-4</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Risk Band</Title>
      <Abstract></Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering polygons -->
      
             <FeatureTypeStyle>
        <Rule>
          <Name>Very low</Name>
          <Title>Very low</Title>

        <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>risk_band</ogc:PropertyName>
              <ogc:Literal>Very low</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#C4E1FF</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
      
             <FeatureTypeStyle>
        <Rule>
          <Name>Low</Name>
          <Title>Low</Title>

        <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>risk_band</ogc:PropertyName>
              <ogc:Literal>Low</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#A2CFFF</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
      
             <FeatureTypeStyle>
        <Rule>
          <Name>Medium</Name>
          <Title>Medium</Title>

          <!-- like a polygonsymbolizer -->
        <ogc:Filter> 
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>risk_band</ogc:PropertyName>
              <ogc:Literal>Medium</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#9AA0DE</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
       </FeatureTypeStyle>
      
      <FeatureTypeStyle>
        <Rule>
          <Name>>High</Name>
          <Title>>High</Title>
          
        <ogc:Filter>         
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>risk_band</ogc:PropertyName>
              <ogc:Literal>High</ogc:Literal>
             </ogc:PropertyIsEqualTo>          
        </ogc:Filter>
          
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#3D4489</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
       </FeatureTypeStyle>
      
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>