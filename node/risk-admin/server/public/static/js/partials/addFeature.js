function addFeature(featureIndex) {
  // Generate HTML for the feature
  const featureHTML = `
    <div id="item_${featureIndex}" class="array-item">
      <div class="form-group field field-object">
        <fieldset id="root_features_${featureIndex}">
          <div class="form-group field field-object">
            <fieldset id="root_features_${featureIndex}_properties">
              <legend id="root_features_${featureIndex}_properties__title">properties</legend>
              <div class="hidden">
                <input type="hidden" id="root_features_${featureIndex}_properties_apply" value="holding">
              </div>
              <div class="form-group field field-string  govuk-form-group riskOverride">
                <label class="control-label" for="root_features_${featureIndex}_properties_riskOverride">
                  Override surface water risk
                </label>
                <p id="root_features_${featureIndex}_properties_riskOverride__description" class="field-description">
                  Choose if the risk for surface water flooding should be overriden for points inside this area
                </p>
                <div class="field-radio-group" id="root_features_${featureIndex}_properties_riskOverride">
                  <div class="radio "><label><span><input type="radio" name="${featureIndex}_riskOverride" value="Do not override"><span>Do not override</span></span></label></div>
                  <div class="radio "><label><span><input type="radio" name="${featureIndex}_riskOverride" value="Very low"><span>Very low</span></span></label></div>
                  <div class="radio "><label><span><input type="radio" name="${featureIndex}_riskOverride" value="Low"><span>Low</span></span></label></div>
                  <div class="radio "><label><span><input type="radio" name="${featureIndex}_riskOverride" value="Medium"><span>Medium</span></span></label></div>
                  <div class="radio "><label><span><input type="radio" name="${featureIndex}_riskOverride" value="High"><span>High</span></span></label></div>
                </div>
              </div>
              <div class="form-group field field-string  govuk-form-group info">
                <label class="control-label" for="root_features_${featureIndex}_properties_info">Info</label>
                <div id="root_features_${featureIndex}_properties_info__description" class="field-description">
                  <p>The info text will display to public users in this geometry. Read <a href="/comment-guidance" target="_blank" previewlistener="true">comment guidance</a> before writing or pasting anything. The maximum number of characters is 150.</p>
                </div>
                <div>
                  <textarea rows="5" id="root_features_${featureIndex}_properties_info" maxlength="150" class="govuk-textarea"></textarea>
                  <p class="govuk-hint govuk-character-count__message">You have 23 characters remaining</p>
                </div>
              </div>
              <div class="form-group field field-string  govuk-form-group start">
                <label class="control-label" for="root_features_${featureIndex}_properties_start">Valid from<span class="required">*</span></label>
                <p id="root_features_${featureIndex}_properties_start__description" class="field-description">For your reference and will not be displayed to public users. Your comments will not be uploaded automatically on this date. Your comments will go live once they’re approved. If a date picker is not available, use YYYY-MM-DD.</p>
                <input type="date" id="root_features_${featureIndex}_properties_start" class="govuk-input govuk-input--width-20" autocomplete="off" required="" value="2019-09-01">
              </div>
              <div class="form-group field field-string  govuk-form-group end">
                <label class="control-label" for="root_features_${featureIndex}_properties_end">Valid to<span class="required">*</span></label>
                <p id="root_features_${featureIndex}_properties_end__description" class="field-description">For your reference and will not be displayed to public users. Your comments will not be removed automatically. It is your responsibility to remove them on the ‘valid to’ date. If a date picker is not available, use YYYY-MM-DD.</p>
                <input type="date" id="root_features_${featureIndex}_properties_end" class="govuk-input govuk-input--width-20" autocomplete="off" required="" value="2020-03-30">
              </div>
            </fieldset>
          </div>
        </fieldset>
      </div>
      <div class="comment-map"></div>
    </div>
  `

  // Append the HTML to the container element
  return featureHTML
}
