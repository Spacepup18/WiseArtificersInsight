function fetchResultsJS(theForm,event) {
  event.preventDefault();

  const formIntegerArray = ["craftAbility", "craftArtifact", "craftAttribute", "lunarcraftAttribute", "intelligence", "stuntDice", "stuntSuccesses", "numAttempts", "terminus", "targetThreshold",
                          "essence", "difficulty", "inspirationRenewingVision", "wordsAsWorkshopMethod", "unwindingGyreMeditation", "storytellerDice", "storytellerSuccesses"];
  const formBooleanArray = ["craftSpeciality","fullExcellency", "willpowerSpend", "exceptionalEquipment", "flawlessHandiworkMethod", "flawlessHandiworkRepurchase", "supremeMasterworkFocus",
                          "supremeMasterworkFocusRepurchase", "supremeMasterworkFocus2ndRepurchase", "experientialConjuringOfTrueVoid", "unbrokenImageFocus",
                          "firstMovementOfTheDemiurge", "breachHealingMethod", "divineInspirationTechnique", "mindExpandingMeditation", "realizingTheFormSupernal",
                          "holisticMiracleUnderstanding", "horizonUnveilingInsight", "sunHeartTenacity", "dbcraftSpeciality", "dbfullExcellency", "stonesFromRubbleRestoration",
						  "flawlessFacetRealization", "strikeTheDragonAnvil", "eternalOmphalosForge", "blazingDragonSmithArete", "strikeTheDragonAnvilRepurchase", "lunarfullExcellency",
						  "wonderWeavingArt", "wonderWeavingArtRepurchase", "wonderWeavingArt2ndRepurchase", "silverCrucibleRefinement", "unboundDemiergesDream"];

  const returnFloatArray = ["meanSuc", "stdDevSuc", "percentSuc"];
  const returnIntegerArray = ["medianSuc","initialPoolSize"];

  const hash = {};

  $.each(formIntegerArray, function(index, item) { hash[item] = parseInt(theForm.elements.namedItem(item).value); });
  $.each(formBooleanArray, function(index, item) { hash[item] = (~~theForm.elements.namedItem(item).checked); });
  hash.initialPoolSize = (Math.min(hash.craftAbility, hash.craftArtifact)*(1 + hash.mindExpandingMeditation) + ((hash.craftAttribute + hash.dbcraftSpeciality)*(1 + hash.dbfullExcellency)))*(1 + hash.fullExcellency)
                        + hash.stuntDice + hash.craftSpeciality + hash.exceptionalEquipment
                        + (hash.breachHealingMethod + hash.experientialConjuringOfTrueVoid)*hash.essence
                        + hash.wordsAsWorkshopMethod
                        + hash.storytellerDice;
  if(hash.lunarfullExcellency) { hash.initialPoolSize += ( hash.craftAttribute + hash.lunarcraftAttribute ); }
  if(hash.ess >= 3 && hash.experientialConjuringOfTrueVoid) { hash.initialPoolSize += hash.intelligence; }
  if(hash.breachHealingMethod) { hash.difficulty--; }
  if(hash.stonesFromRubbleRestoration)	{ hash.initialPoolSize += (Math.floor(hash.essence/2)); }
  if(hash.blazingDragonSmithArete) { 
	hash.initialPoolSize += hash.essence; 
	hash.terminus--;
	}
  if(hash.silverCrucibleRefinement) { hash.initialPoolSize += hash.essence }
	
  if(hash.horizonUnveilingInsight) { hash.terminus = 7; }
  if(hash.eternalOmphalosForge) { hash.terminus++ }
  
  if(hash.unboundDemiergesDream) { hash.terminus += Math.floor(hash.essence/3); }

  hash.terminus += hash.inspirationRenewingVision + hash.unwindingGyreMeditation;
  if(hash.unwindingGyreMeditation) { hash.targetThreshold -= (5 + hash.unwindingGyreMeditation*hash.essence); }

  if(hash.realizingTheFormSupernal) {
    hash.difficulty--;
    hash.targetThreshold -= hash.intelligence*hash.essence;
  }

  if(hash.difficulty < 0) { hash.difficulty = 0; }

  const attemptArray = collectAttemptStatistics(hash);

  const data = {};

  data.meanSuc = arrayMean(attemptArray);
  data.medianSuc = arrayMedian(attemptArray);
  data.stdDevSuc = arrayStdDev(attemptArray);
  data.percentSuc = 100*arrayPercentAboveThreshold(attemptArray,parseInt(hash.targetThreshold));
  data.initialPoolSize = hash.initialPoolSize;
  data.hist = arrayHistogram(attemptArray);

  $.each(returnFloatArray, function(index, item) { document.getElementById(item).innerHTML = data[item].toFixed(2); });
  $.each(returnIntegerArray, function(index, item) { document.getElementById(item).innerHTML = data[item]; });

  renderHistogram(data, hash, theForm);
}
