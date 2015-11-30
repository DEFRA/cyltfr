<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
 xmlns="http://www.opengis.net/sld" 
 xmlns:ogc="http://www.opengis.net/ogc" 
 xmlns:xlink="http://www.w3.org/1999/xlink" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>SWD</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Surface water depth</Title>
      <Abstract></Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering polygons -->
      <FeatureTypeStyle>
        
        
        <Rule>
          <Name>> 0.9m</Name>
          <Title>> 0.9m</Title>
          
        <ogc:Filter>
          <ogc:Or>
            
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>depth</ogc:PropertyName>
              <ogc:Literal>0.90 - 1.20</ogc:Literal>
             </ogc:PropertyIsEqualTo>
            
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>depth</ogc:PropertyName>
              <ogc:Literal>> 1.20</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            
          </ogc:Or>
        </ogc:Filter>
          
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#3D4489</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
        
        <Rule>
          <Name>0.3 - 0.9m</Name>
          <Title>0.3 - 0.9m</Title>

          <!-- like a polygonsymbolizer -->
        <ogc:Filter>
          <ogc:Or>
            
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>depth</ogc:PropertyName>
              <ogc:Literal>0.30 - 0.60</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>depth</ogc:PropertyName>
              <ogc:Literal>0.60 - 0.90</ogc:Literal>
            </ogc:PropertyIsEqualTo>

          </ogc:Or>
          
        </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#6699CD</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
        
        <Rule>
          <Name>0 - 0.3m</Name>
          <Title>0 - 0.3m</Title>

        <ogc:Filter>
          <ogc:Or>

            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>depth</ogc:PropertyName>
              <ogc:Literal>0.15 - 0.30</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>depth</ogc:PropertyName>
              <ogc:Literal>0.00 - 0.15</ogc:Literal>
            </ogc:PropertyIsEqualTo>

          </ogc:Or>
          
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